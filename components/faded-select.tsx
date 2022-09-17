import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ReactElement } from "react";

interface FadedSelectProps {
  defaultValue: string | number;
  items: [key: string | number, value: string | number][];
  label: string;
  onChange: (value: string | number) => void;
  isMenuItemDisabled?: (
    item: [key: string | number, value: string | number]
  ) => boolean;
}

export const FadedSelect = ({
  defaultValue,
  items,
  label,
  onChange,
  isMenuItemDisabled,
}: FadedSelectProps): ReactElement => {
  return (
    <FormControl size="small" className="m-4 self-end">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={defaultValue}
        label={label}
        MenuProps={{ style: { maxHeight: 200 } }}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((item) => (
          <MenuItem
            disabled={isMenuItemDisabled?.(item)}
            key={item[0]}
            value={item[0]}
          >
            {item[1]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
