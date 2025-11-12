import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@nouvelle/router";

export const Preferences = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column">
        <Heading>Preferences</Heading>
        <Separator className="mt-2 !w-full" />
      </Flex>

      <Flex direction="column" gap="3" className="px-4">
        <Flex direction="column" gap="2">
          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">
              Color theme
            </Text>
            <Text size="1" color="gray">
              Choose your preferred color theme for the interface
            </Text>
          </Flex>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">Use system setting</SelectItem>
            </SelectContent>
          </Select>
        </Flex>
      </Flex>
    </Flex>
  );
};
