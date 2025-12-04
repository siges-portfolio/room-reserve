export interface SidebarNavigationGroup {
  title: string;
  items: SidebarNavigationItem[]
}

export interface SidebarNavigationItem {
  id: string;
  icon: string;
  title: string;
  url: string;
}

export type SidebarNavigation = SidebarNavigationGroup[]
