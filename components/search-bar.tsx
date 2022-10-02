import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWindowSize } from "hooks/useWindowSize";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import { VariableSizeList } from "react-window";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";

interface ISearchBarProps {
  allPlayers: IEssentialPlayerData[];
  onPlayerSelect?: (playerId: number) => void;
}
// eslint-disable-next-line react/display-name
const SearchBar = ({ allPlayers, onPlayerSelect }: ISearchBarProps) => {
  const router = useRouter();
  const { width } = useWindowSize();

  const compareAgainst =
    typeof router.query.compareAgainst === "string"
      ? [router.query.compareAgainst]
      : router.query.compareAgainst;

  const players = allPlayers.filter(
    (x) =>
      x.id === +(router.query.id ?? 0) ||
      (compareAgainst && compareAgainst.includes(String(x.id)))
  );

  return (
    <div className="m-4 ">
      <Autocomplete
        onChange={(_, players) => {
          if (players && players[0]) {
            const firstPlayer =
              players.find((x) => x.id === +(router.query.id ?? 0)) ??
              players[0];

            const comparedPlayers = players.filter(
              (x) => x.id !== firstPlayer.id
            );
            onPlayerSelect?.(firstPlayer.id);
            router.push(
              {
                pathname: `/players/${firstPlayer.id}`,
                query: { compareAgainst: comparedPlayers.map((x) => x.id) },
              },
              undefined,
              //Disable data fetching when we amend URL
              { shallow: true }
            );
          } else {
            router.push("/players", undefined, { shallow: true });
          }
        }}
        id="player"
        sx={{ width: width < 768 ? "100%" : 200 }}
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent as any}
        options={allPlayers}
        getOptionLabel={(player) => player?.name ?? "Unknown"}
        groupBy={(player) => player?.name[0]?.toUpperCase() ?? "Unknown"}
        renderInput={(params) => (
          <TextField {...params} label="Choose Player" variant="standard" />
        )}
        renderOption={((props: any, option: any) => [props, option]) as any}
        renderGroup={(params) => params as any}
        value={players}
        multiple={true}
      />
    </div>
  );
};

const LISTBOX_PADDING = 8; // px

function renderRow(props: any) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      //Individual Letter Dropdown Component
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }
  return (
    //Individual Dropdown Player Name
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1].name}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref as any} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      (ref.current as any).resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props: any,
  ref
) {
  const { children, ...other }: { children: any } = props;
  const itemData: any = [];
  children.forEach((item: any) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });

  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child: any) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData
      .map(getChildSize)
      .reduce((a: number, b: number) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref as any}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
