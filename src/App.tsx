import React, { useCallback, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { ThemeProvider } from "@mui/material/styles";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import theme from "./theme";
import Fuse from "fuse.js";

import { APIResponse } from "./types";
import Event from "./Event";
import Searchbar from "./Searchbar";

import "./App.scss";

type SortedEvents = {
  [key: string]: APIResponse[];
};

const getData = async (): Promise<SortedEvents> => {
  const data: APIResponse[] = await fetch(
    "https://tlv-events-app.herokuapp.com/events/uk/london"
  ).then((res) => res.json());
  const EVENTS_BY_DATES: SortedEvents = {};
  const sorted = data.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  sorted.forEach((event) => {
    const date = new Date(event.startTime);
    if (!(date instanceof Date && !isNaN(Number(date)))) return;
    const key = date.toLocaleString("de-DE", { dateStyle: "short" });
    const events = EVENTS_BY_DATES[key];
    EVENTS_BY_DATES[key] = events ? [...events, ...[event]] : [event];
  });
  return EVENTS_BY_DATES;
};

function App() {
  const [search, setSearch] = useState<string>("");
  const [stickyDate, setStickyDate] = useState<string>("");
  const [data, setData] = useState<SortedEvents | undefined>(undefined);
  const [filteredData, setFilteredData] = useState<SortedEvents | undefined>(undefined);
  const [selected, setSelected] = useState<APIResponse[] | undefined>(undefined);
  const [showSelected, setShowSelected] = useState<boolean>(false);

  useEffect(() => {
    async function initialData() {
      const eventData = await getData();
      setData(eventData);
      setFilteredData(eventData);
    }
    initialData();
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log(selected);
    const result = Object.keys(data).reduce((events: SortedEvents, date: string) => {
      events[date] = events[date] ?? [];
      events[date].push(...data[date].filter((e) => !selected?.includes(e)));
      return events;
    }, {});
    setFilteredData(result);
  }, [selected]);

  const onSelect = (event: APIResponse) => {
    setSelected(selected ? [...selected, event] : [event]);
  };

  const onDeselect = (event: APIResponse) => {
    setSelected(selected?.filter((e) => e._id !== event._id));
  };

  const memoizedCallback = useCallback(onSelect, [selected]);

  const updatedSearch = (term: string) => {
    setSearch(term);
  };

  const onScroll = (e: any) => {
    const content = document.getElementById("content");
    const scrolledDivs: any = Array.from(content?.childNodes ?? []).filter(
      (child: any) => e.target.scrollTop >= child.offsetTop - 110
    );
    if (scrolledDivs.length > 0) {
      if (scrolledDivs[scrolledDivs.length - 1].id !== stickyDate)
        setStickyDate(scrolledDivs[scrolledDivs.length - 1].id);
    }
  };

  if (!filteredData) return <p>loading...</p>;

  const options = {
    threshold: 0.4,
    keys: ["title", "venue.name", "artists.name"],
  };
  let searchResults: SortedEvents = Object.assign({}, filteredData);

  if (search) {
    Object.keys(filteredData).forEach((date) => {
      const fuse = new Fuse(Object.values(filteredData[date]!), options);
      const filteredEvents = fuse.search(search).map((result) => {
        return result.item;
      });
      searchResults[date] = filteredEvents;
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <header className="header">
          <Searchbar onChange={updatedSearch} />
          {showSelected && (
            <ClickAwayListener onClickAway={() => setShowSelected(false)}>
              <ul className="selected-events">
                <h2>Selected Events</h2>
                {selected && selected?.length > 0 ? (
                  selected?.map((event) => (
                    <li key={event._id}>
                      <div style={{ display: "flex" }}>
                        <RemoveCircleIcon
                          style={{ height: "15px", color: "red", cursor: "pointer" }}
                          onClick={() => onDeselect(event)}
                        />
                        {event.title} @ {event.venue.name}
                      </div>
                    </li>
                  ))
                ) : (
                  <p>none</p>
                )}
              </ul>
            </ClickAwayListener>
          )}
          <div className="cart" onClick={() => setShowSelected(!showSelected)}>
            <ShoppingCartIcon color="primary" />
            {selected && selected.length > 0 && (
              <div className="indicator">
                <p>{selected?.length}</p>
              </div>
            )}
          </div>
        </header>
        <main onScroll={onScroll}>
          <div id="content">
            <h1>Public Events</h1>
            {Object.keys(searchResults)
              .sort((a, b) => {
                return new Date(a).getTime() - new Date(b).getTime();
              })
              .filter((date) => searchResults[date].length > 0)
              .map((date, i) => {
                return (
                  <div key={i} id={date}>
                    <h2 className={stickyDate === date ? "sticky" : ""}>{date}</h2>
                    <div className="grid" key={i}>
                      {searchResults[date].map((event, i) => (
                        <Event
                          key={`${i}-${event._id}`}
                          event={event}
                          onSelect={memoizedCallback}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
