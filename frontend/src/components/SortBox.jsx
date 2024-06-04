function SortBox() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // Add sorting logic based on the selected option
  };

  const getOptionStyle = (option) => {
    if (selectedOption === option) {
      return {
        color: "#2196F3",
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
      };
    } else {
      return {
        color: "black",
        cursor: "pointer",
      };
    }
  };

  return (
    <div className="">
      <h1 className="font-bold m-3">Showing 1-24 result for "iphone-13"</h1>
      <br />
      <div className=" ml-3 flex flex-row space-x-4">
        <div
          style={getOptionStyle("Relevance")}
          onClick={() => handleOptionClick("Relevance")}
        >
          Relevance
        </div>
        <div
          style={getOptionStyle("Popularity")}
          onClick={() => handleOptionClick("Popularity")}
        >
          Popularity
        </div>
        <div
          style={getOptionStyle("Price High to Low")}
          onClick={() => handleOptionClick("Price High to Low")}
        >
          Price High to Low
        </div>
        <div
          style={getOptionStyle("Price Low to High")}
          onClick={() => handleOptionClick("Price Low to High")}
        >
          Price Low to High
        </div>
      </div>
      <hr />
    </div>
  );
}

export default SortBox;
