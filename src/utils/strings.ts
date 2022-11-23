// Makes shorter text with ellipsis in the center
export const centerEllipsis = (text: string, width = 4, prefix = 2): string =>
  text
    ? text.length > width * 2 + prefix
      ? `${text.substring(0, width + prefix)}...${text.substring(
          text.length - width - prefix,
        )}`
      : text
    : '';
