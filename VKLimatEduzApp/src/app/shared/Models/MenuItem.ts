interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  route?: string;
  isBranch?: boolean;
  isActive?: boolean;
  children?: MenuItem[];
  isExpanded?: boolean;
}
