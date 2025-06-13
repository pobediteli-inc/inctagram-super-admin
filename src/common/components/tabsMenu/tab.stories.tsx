import * as Tabs from "@radix-ui/react-tabs";
import { Meta, StoryObj } from "@storybook/react";
import { Props, Tab } from "./tab";

const meta: Meta<typeof Tab> = {
  title: "Components/RadixTabs",
  component: Tab,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary"],
    },
    value: { control: "text" },
    title: { control: "text" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Tab>;

const Template = (args: Props) => (
  <Tabs.Root defaultValue={args.value}>
    <Tabs.List>
      <Tab {...args} />
    </Tabs.List>
  </Tabs.Root>
);

export const Primary: Story = {
  render: Template,
  args: {
    variant: "secondary",
    value: "tab1",
    title: "Tabs",
  },
};

export const Secondary: Story = {
  render: Template,
  args: {
    variant: "secondary",
    value: "tab2",
    title: "Tabs",
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    variant: "secondary",
    value: "tab2",
    title: "Tabs",
    disabled: true,
  },
};
