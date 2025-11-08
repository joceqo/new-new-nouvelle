import type { Meta, StoryObj } from '@storybook/react-vite';

import Text from '@/components/design_system/Typography/Text';

const meta: Meta<typeof Text> = {
    title: 'Design System/Typography/Text',
    component: Text,
    parameters: {
        layout: 'padded'
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            description: 'Text size (1 is smallest, 9 is largest)'
        },
        weight: {
            control: 'select',
            options: ['light', 'regular', 'medium', 'bold'],
            description: 'Font weight'
        },
        align: {
            control: 'select',
            options: ['left', 'center', 'right'],
            description: 'Text alignment'
        },
        as: {
            control: 'select',
            options: ['p', 'span', 'div', 'label'],
            description: 'HTML element'
        },
        color: {
            control: 'select',
            options: [
                'gray',
                'gold',
                'bronze',
                'brown',
                'yellow',
                'amber',
                'orange',
                'tomato',
                'red',
                'ruby',
                'crimson',
                'pink',
                'plum',
                'purple',
                'violet',
                'iris',
                'indigo',
                'blue',
                'cyan',
                'teal',
                'jade',
                'green',
                'grass',
                'lime',
                'mint',
                'sky'
            ],
            description: 'Text color'
        },
        trim: {
            control: 'select',
            options: ['normal', 'start', 'end', 'both'],
            description: 'Trim whitespace from the text'
        }
    },
    args: {
        children: 'The quick brown fox jumps over the lazy dog',
        size: '3',
        as: 'p'
    }
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
    args: {}
};

export const Small: Story = {
    args: {
        size: '1',
        children: 'Small text for captions or helper text'
    }
};

export const Medium: Story = {
    args: {
        size: '3',
        children: 'Medium text for body content'
    }
};

export const Large: Story = {
    args: {
        size: '6',
        children: 'Large text for emphasis'
    }
};

export const Bold: Story = {
    args: {
        size: '3',
        weight: 'bold',
        children: 'Bold text for emphasis'
    }
};

export const Colored: Story = {
    args: {
        size: '3',
        color: 'blue',
        children: 'Colored text example'
    }
};

export const Centered: Story = {
    args: {
        size: '3',
        align: 'center',
        children: 'Centered text alignment'
    }
};

export const AsSpan: Story = {
    args: {
        as: 'span',
        children: 'This is an inline span element'
    }
};

export const AllSizes: Story = {
    render: () => (
        <>
            <Text size="1" as="p">
                Text Size 1 - Smallest
            </Text>
            <Text size="2" as="p">
                Text Size 2
            </Text>
            <Text size="3" as="p">
                Text Size 3 - Default body
            </Text>
            <Text size="4" as="p">
                Text Size 4
            </Text>
            <Text size="5" as="p">
                Text Size 5
            </Text>
            <Text size="6" as="p">
                Text Size 6
            </Text>
            <Text size="7" as="p">
                Text Size 7
            </Text>
            <Text size="8" as="p">
                Text Size 8
            </Text>
            <Text size="9" as="p">
                Text Size 9 - Largest
            </Text>
        </>
    )
};

export const AllWeights: Story = {
    render: () => (
        <>
            <Text weight="light" as="p">
                Light weight
            </Text>
            <Text weight="regular" as="p">
                Regular weight
            </Text>
            <Text weight="medium" as="p">
                Medium weight
            </Text>
            <Text weight="bold" as="p">
                Bold weight
            </Text>
        </>
    )
};

export const Paragraph: Story = {
    args: {
        size: '3',
        children:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    }
};
