"use client";
import { useState } from "react";
import ItemStore from "./ItemStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default {
  title: "MODULES/itemStore",
  component: ItemStore,
  tags: ["autodocs"],
  parameters: {
    controls: { expanded: true },
  },
};

export const Default = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<boolean>(false);
    const queryClient = new QueryClient();
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <ItemStore setState={setSelectedValue} />
        </QueryClientProvider>
      </>
    );
  },
};
