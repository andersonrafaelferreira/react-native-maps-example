import React from "react";
import { Button, Text, TextInput, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import Test from "./Test";

describe("elements that should be on the screen", async () => {
  it("shoud have a container element to render the map", async () => {
    const { getByTestId } = render(<Test />);

    const container = getByTestId("map-container");
    expect(container).toBeTruthy();
  });

  it("should contain 2 specifcs texts after tap on button", async () => {
    const { getByTestId, getByText } = render(<Test />);

    const button = getByTestId("show-history");
    fireEvent.press(button);
    const history = getByText("Histórico");

    const clear = getByText("Apagar Lista");
  });

  it("should generate a JSON version taking a snapshot", async () => {
    const { toJSON } = render(<Test />);

    expect(toJSON()).toMatchSnapshot();
  });
});
