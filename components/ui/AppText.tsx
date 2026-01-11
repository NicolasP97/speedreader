import { Text, TextProps, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

type AppTextVariant = "primary" | "secondary" | "accent";

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
}

export function AppText({
  variant = "primary",
  style,
  ...props
}: AppTextProps) {
  return (
    <Text {...props} style={[styles.base, variantStyles[variant], style]} />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
    fontSize: 16,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    color: colors.textPrimary,
  },
  secondary: {
    color: colors.textSecondary,
  },
  accent: {
    color: colors.primary,
  },
});
