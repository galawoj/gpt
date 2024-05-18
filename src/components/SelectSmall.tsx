import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type propsModel = {
  onChangeModel: (model: string) => void;
};

export default function SelectSmall({ onChangeModel }: propsModel) {
  const [model, setModel] = React.useState("gpt-3.5-turbo");

  const handleChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
    onChangeModel(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">model</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={model}
        label="model"
        onChange={handleChange}
      >
        <MenuItem value={"gpt-4o"}>GPT-4o New</MenuItem>
        <MenuItem value={"gpt-4-turbo"}>GPT-4 Turbo</MenuItem>
        <MenuItem value={"gpt-3.5-turbo"}>GPT-3.5 Turbo</MenuItem>
      </Select>
    </FormControl>
  );
}
