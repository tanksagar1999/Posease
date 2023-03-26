import allWordGirlList from "all-girl";

let girlList = allWordGirlList();

let lifePartner = girlList.find(
  (val) =>
    val.cast == "prajapati" &&
    val.field == "Computer" &&
    val.location == "jamnagar" &&
    val.name == "anjali"
);
if (lifePartner) {
  return "Dream Compalted";
}
