import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { type ModelType } from "../models/ModelType";

type propsModel = {
  onChangeModel: (model: ModelType) => void;
};

export default function SelectSmall({ onChangeModel }: propsModel) {
  const [model, setModel] = React.useState("gpt-3.5-turbo");

  const handleChange = (event: SelectChangeEvent) => {
    const eventValue = event.target.value as ModelType;
    setModel(eventValue);
    onChangeModel(eventValue);
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
