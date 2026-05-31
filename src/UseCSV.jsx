import { useEffect, useState } from "react";

export const useCSV = (url, mapper) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(url);
      const text = await res.text();

      const rows = text.trim().split(/\r?\n/);

      setData(rows.slice(1).map((r) => mapper(r.split(","))));
    };

    load();
  }, [url]);

  return data;
};
