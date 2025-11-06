import { SortFilterItem } from "../../../../lib/constants";
import { FilterItem } from "./item";
import FilterItemDropDown from "./dropdown";

export type PathFilterItem = { title: string; path: string };
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList({
  list,
  onFilterStart,
}: {
  list: ListItem[];
  onFilterStart?: () => void;
}) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} onFilterStart={onFilterStart} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
  onFilterStart,
}: {
  list: ListItem[];
  title?: string;
  onFilterStart?: () => void;
}) {
  return (
    <>
      <nav>
        {title ? (
          <h3 className="hidden text-xs text-neutral-500 md:block ">{title}</h3>
        ) : null}
        <ul className="hidden md:block">
          <FilterItemList list={list} onFilterStart={onFilterStart} />
        </ul>
        <ul className="md:hidden">
          <FilterItemDropDown list={list} onFilterStart={onFilterStart} />
        </ul>
      </nav>
    </>
  );
}
