import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
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
        <OutlinedInput
          size="small"
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={updateSearch} edge="end">
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          }
          color="primary"
          id="outlined-basic"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Searchbar;
