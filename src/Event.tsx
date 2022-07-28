import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { memo } from "react";
import { APIResponse } from "./types";

import "./Event.scss";

const formatDate = (date: string): string => {
  return new Date(date).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "medium" });
};

type Props = {
  event: APIResponse;
  onSelect: (event: APIResponse) => void;
};

const Event = (props: Props) => {
  return (
    <div className="Event">
      <div className="title">
        <div className="icon"></div>
        <strong>{props.event.title}</strong>
      </div>
      <img src={props.event.flyerFront} alt="flyer" />
      <div className="content">
        <div className="location">
          <LocationOnIcon />
          <a href={props.event.venue.direction} target="_blank" rel="noreferrer">
            {props.event.venue.name}
          </a>
        </div>
        <p>Starts: {formatDate(props.event.startTime)}</p>
        <p>Ends: {formatDate(props.event.endTime)}</p>
        <Fab color="primary" aria-label="add" onClick={() => props.onSelect(props.event)}>
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default memo(Event);
