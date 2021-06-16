import { CardComponent1, CardComponent2, CardComponent3 } from "./components";

export const data = [
  {
    id: 1,
    label: "devarsh",
    columnID: "AHD",
  },
  {
    id: 2,
    label: "dvija",
    columnID: "AHD",
  },
  {
    id: 3,
    label: "nirali",
    columnID: "US",
  },
  {
    id: 4,
    label: "harsh",
    columnID: "US",
  },
  {
    id: 5,
    label: "aayush",
    columnID: "US",
  },
  { id: 6, label: "urja", columnID: "AHD" },
  {
    id: 7,
    label: "shimoli",
    columnID: "BOM",
  },
  {
    id: 8,
    label: "rimoni",
    columnID: "BOM",
  },
  {
    id: 9,
    label: "hriman",
    columnID: "CN",
  },
  {
    id: 10,
    label: "aryaman",
    columnID: "CN",
  },
];

export const columns = [
  {
    label: "Ahmedabad",
    id: "AHD",
    component: CardComponent1,
  },
  {
    label: "Mumbai",
    id: "BOM",
    component: CardComponent2,
  },
  {
    label: "Canada",
    id: "CN",
    component: CardComponent3,
  },
  {
    label: "USA",
    id: "US",
    component: CardComponent3,
  },
];
