import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState, useEffect } from "react";

const CustomMultiselect = ({
  items,
  label,
  placeholder,
  selectAllLabel = "Select All",
  limitTags = 2,
  noOptionsText = "No options",
  onChange,
  selectAllByDefault = false, 
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const allSelected = items.length > 0 && selectedValues.length === items.length;



  useEffect(() => {
    if (selectAllByDefault) {
      const allValues = items.map((item) => item.value);
      setSelectedValues(allValues);
      onChange && onChange(allValues);
    }
  }, [selectAllByDefault, items, onChange]);

  const handleChange = (event, newValue, reason) => {
    if (reason === "selectOption" || reason === "removeOption") {
      const isSelectAll = newValue.some((item) => item.value === "select-all");

      if (isSelectAll) {
        if (allSelected) {
          setSelectedValues([]);
          onChange && onChange([]);
        } else {
          const allValues = items.map((item) => item.value);
          setSelectedValues(allValues);
          onChange && onChange(allValues);
        }
      } else {
        const selected = newValue.filter((item) => item.value !== "select-all").map((item) => item.value);
        setSelectedValues(selected);
        onChange && onChange(selected);
      }
    } else if (reason === "clear") {
      setSelectedValues([]);
      onChange && onChange([]);
    }
  };

  const renderOption = (props, option, { selected }) => {
    const isSelectAllOption = option.value === "select-all";
    const isChecked = isSelectAllOption ? allSelected : selectedValues.includes(option.value);
    const { key, ...restProps } = props;
    return (
      <li key={key} {...restProps}>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          sx={{ marginRight: 8, color: "primary.main" }}
          checked={isChecked}
        />
        {option.label}
      </li>
    );
  };

  return (
    <Autocomplete
      multiple
      size="small"
      disableCloseOnSelect
      limitTags={limitTags}
      options={[{ label: selectAllLabel, value: "select-all" }, ...items]}
      value={items.filter((item) => selectedValues.includes(item.value))} 
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      noOptionsText={noOptionsText}
      onChange={handleChange}
      renderOption={renderOption}
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          height: "40px",
          alignItems: "center",
          overflowY: "hidden",
        },
        "& .MuiAutocomplete-input": {
          padding: "0px !important",
        },
        "& .MuiAutocomplete-tag": {
          maxWidth: "100px",
          color: "bodycolor.text",
        },
        "& .MuiPopper-root .MuiAutocomplete-popper": {
          color: "bodycolor.text",
          backgroundColor: "primary.main",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          sx={{
            height: "40px",
            "& .MuiInputBase-root": {
              height: "100%",
            },
            color: "bodycolor.text",
          }}
        />
      )}
    />
  );
};

export default CustomMultiselect;
