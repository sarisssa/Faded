import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import { VariableSizeList } from "react-window";
import { IEssentialPlayerData } from "../interfaces/props/ISearchBarProps";

interface ISearchBarProps {
  allPlayers: IEssentialPlayerData[];
}

export default function SearchBar({ allPlayers }: ISearchBarProps) {
  const router = useRouter();

  return (
    <Autocomplete
      onChange={(_, player) => {
        if (player) {
          router.push(`/players/${player.id}`);
        }
      }}
      id="player"
      sx={{ width: 300 }}
      disableListWrap
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent as any}
      options={allPlayers}
      getOptionLabel={(player) => player.name}
      groupBy={(player) => player.name[0].toUpperCase()}
      renderInput={(params) => <TextField {...params} label="Choose Player" />}
      renderOption={((props: any, option: any) => [props, option]) as any}
      renderGroup={(params) => params as any}
    />
  );
}

const LISTBOX_PADDING = 8; // px

function renderRow(props: any) {
  console.log(props);
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

function random(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});
