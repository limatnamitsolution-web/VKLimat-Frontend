interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  route?: string;
  isActive?: boolean;
  children?: MenuItem[];
  isExpanded?: boolean;
}
