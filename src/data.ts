export type Variety = "meadow" | "linden" | "buckwheat" | "cream";

export interface Honey {
  id: Variety;
  name: string;
  short: string;
  latin: string;
  description: string;
  story: string;
  notes: string[];
  harvest: string;
  pairing: string;
  price: number;
  color: string;
  dark: string;
  pale: string;
  ink: string;
  character: [number, number, number];
}

// Sample assortment and prices for the visual prototype, not a live stock list.
export const honeys: Honey[] = [
  {
    id: "meadow",
    name: "Pļavu ziedu",
    short: "Pļava",
    latin: "Flores pratenses",
    description:
      "Āboliņš, pienenes un viss pārējais, kas tajā vasarā ziedēja. Pļava katru gadu raksta citu recepti.",
    story:
      "Bites neizvēlas vienu ziedu. Tās pārnes mājās visu pļavu — sīkus āboliņa ziedus, pienenes, vasaras smaržu. Tāpēc šis medus ir mazliet citāds katrā ievākumā.",
    notes: ["Ziedains", "Maigs", "Silts"],
    harvest: "Jūnijs — jūlijs",
    pairing: "Uz rupjmaizes. Pie rīta putras. Vai vienkārši no karotes.",
    price: 7.5,
    color: "#bd801e",
    dark: "#58330c",
    pale: "#eeeadf",
    ink: "#323c29",
    character: [68, 35, 55],
  },
  {
    id: "linden",
    name: "Liepu",
    short: "Liepa",
    latin: "Tilia cordata",
    description:
      "Īss ziedēšanas brīdis, kas paliek burciņā. Liepu ziedu smarža ar svaigu, mazliet piparmētrainu noti.",
    story:
      "Kad sāk ziedēt liepas, koks dūc. Bites izmanto katru silto stundu. Burciņā paliek gaišs medus un pavisam īsas vasaras epizodes smarža.",
    notes: ["Svaigs", "Liepu ziedi", "Gaišs"],
    harvest: "Jūlijs",
    pairing: "Pie liepziedu tējas, kad tā mazliet atdzisusi.",
    price: 8,
    color: "#c5a44a",
    dark: "#746023",
    pale: "#e6e9db",
    ink: "#364634",
    character: [55, 70, 30],
  },
  {
    id: "buckwheat",
    name: "Griķu",
    short: "Griķi",
    latin: "Fagopyrum esculentum",
    description:
      "Tumšs kā augusta vakars. Izteiksmīgs, iesalains medus ar raksturu, kuru nevar sajaukt.",
    story:
      "Balti, sīki griķu ziedi dod pārsteidzoši tumšu medu. Tā garša ir dziļāka — mazliet iesala, mazliet zemes, ilga pēcgarša.",
    notes: ["Iesalains", "Dziļš", "Tumšs"],
    harvest: "Augusts",
    pairing: "Ar nobriedušu sieru, uz grauzdētas rudzu maizes.",
    price: 8.5,
    color: "#65370e",
    dark: "#2b1708",
    pale: "#e7ddd0",
    ink: "#442e21",
    character: [40, 90, 85],
  },
  {
    id: "cream",
    name: "Krēmveida",
    short: "Krēms",
    latin: "Mel crematum",
    description:
      "Tas pats medus, cita sajūta. Lēni maisīts, līdz kļūst maigs, samtains un viegli uzziežams.",
    story:
      "Medus dabiski kristalizējas. Saudzīgi maisot, kristāli kļūst smalki un medus iegūst viendabīgu, krēmīgu tekstūru. Nekas lieks nav jāpievieno.",
    notes: ["Samtains", "Maigs", "Krēmīgs"],
    harvest: "Vasaras ievākums",
    pairing: "Uz siltas maizes. Lēnām, līdz pašai maliņai.",
    price: 8,
    color: "#d3b875",
    dark: "#b89c61",
    pale: "#f0ebe1",
    ink: "#504635",
    character: [80, 20, 45],
  },
];

export const seasons = [
  {
    month: "APR",
    name: "Aprīlis",
    flowers: "Pūpoli · pirmie ziedi",
    title: "Drava mostas.",
    text: "Pirmajās siltajās dienās bites atkal iziet saulē. Pavasaris vēl tikai mēģina savu balsi.",
    variety: "linden" as Variety,
  },
  {
    month: "MAI",
    name: "Maijs",
    flowers: "Pienenes · ābeļziedi",
    title: "Viss sāk ziedēt.",
    text: "Dzeltenas pļavas un balti ābeļdārzi. Darba diena sākas līdz ar pirmo silto gaismu.",
    variety: "meadow" as Variety,
  },
  {
    month: "JŪN",
    name: "Jūnijs",
    flowers: "Āboliņš · pļavu ziedi",
    title: "Garākās dienas.",
    text: "Pļava zied daudzās balsīs. Burciņā tās vēlāk būs grūti atšķirt — un tas ir pats skaistākais.",
    variety: "meadow" as Variety,
  },
  {
    month: "JŪL",
    name: "Jūlijs",
    flowers: "Liepas · vasaras ziedi",
    title: "Liepas dūc.",
    text: "Uz brīdi viss koks kļūst par dravu. Īss ziedēšanas laiks, gara atmiņa par vasaru.",
    variety: "linden" as Variety,
  },
  {
    month: "AUG",
    name: "Augusts",
    flowers: "Griķi · vēlie ziedi",
    title: "Vasara kļūst dziļāka.",
    text: "Vēlie ziedi maina medus krāsu un raksturu. Katram ievākumam ir sava noskaņa.",
    variety: "buckwheat" as Variety,
  },
  {
    month: "SEP",
    name: "Septembris",
    flowers: "Virši · rudens miers",
    title: "Paliek vasaras garša.",
    text: "Dravā darbs nebeidzas, bet ritms kļūst klusāks. Medus glabā to, ko pļava jau aizmirsusi.",
    variety: "cream" as Variety,
  },
];

export const money = (amount: number) =>
  new Intl.NumberFormat("lv-LV", { style: "currency", currency: "EUR" }).format(
    amount,
  );
