import type { Meta, StoryObj } from "@storybook/react-vite";

import Heading from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "Design System/Typography/Heading",
  component: Heading,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      description: "Heading size (1 is largest, 9 is smallest)",
    },
    weight: {
      control: "select",
      options: ["light", "regular", "medium", "bold"],
      description: "Font weight",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Text alignment",
    },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "HTML heading element",
    },
    color: {
      control: "select",
      options: [
        "gray",
        "gold",
        "bronze",
        "brown",
        "yellow",
        "amber",
        "orange",
        "tomato",
        "red",
        "ruby",
        "crimson",
        "pink",
        "plum",
        "purple",
        "violet",
        "iris",
        "indigo",
        "blue",
        "cyan",
        "teal",
        "jade",
        "green",
        "grass",
        "lime",
        "mint",
        "sky",
      ],
      description: "Text color",
    },
  },
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    size: "6",
    as: "h2",
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: {
    size: "1",
    as: "h1",
    children: "Large Heading",
  },
};

export const Medium: Story = {
  args: {
    size: "4",
    as: "h2",
    children: "Medium Heading",
  },
};

export const Small: Story = {
  args: {
    size: "7",
    as: "h3",
    children: "Small Heading",
  },
};

export const Bold: Story = {
  args: {
    size: "4",
    weight: "bold",
    children: "Bold Heading",
  },
};

export const Colored: Story = {
  args: {
    size: "4",
    color: "blue",
    children: "Colored Heading",
  },
};

export const Centered: Story = {
  args: {
    size: "4",
    align: "center",
    children: "Centered Heading",
  },
};

export const AllSizes: Story = {
  render: () => (
    <>
      <Heading size="1" as="h1">
        Heading Size 1
      </Heading>
      <Heading size="2" as="h2">
        Heading Size 2
      </Heading>
      <Heading size="3" as="h3">
        Heading Size 3
      </Heading>
      <Heading size="4" as="h4">
        Heading Size 4
      </Heading>
      <Heading size="5" as="h5">
        Heading Size 5
      </Heading>
      <Heading size="6" as="h6">
        Heading Size 6
      </Heading>
      <Heading size="7">Heading Size 7</Heading>
      <Heading size="8">Heading Size 8</Heading>
      <Heading size="9">Heading Size 9</Heading>
    </>
  ),
};
