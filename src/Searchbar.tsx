import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

import "./Searchbar.scss";

type Props = {
  onChange: (e: any) => void;
};

function Searchbar(props: Props) {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const updateSearch = (e: any) => {
    e.preventDefault();
    props.onChange(searchTerm);
  };
  return (
    <div className="Searchbar">
      <form onSubmit={updateSearch}>
        <TextField
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          color="primary"
          id="outlined-basic"
          placeholder="..."
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Searchbar;
