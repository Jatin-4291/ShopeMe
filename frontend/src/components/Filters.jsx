import ProgressBar from "@ramonak/react-progress-bar";
function Filters() {
  return (
    <div className="m-3 bg-white h-screen">
      <h1 className="mt-2 text-2xl">Filters</h1>

      <br />
      <div>
        <h3>CATAGORIES</h3>
        <br />
        <div className="flex flex-col items-start">
          <button className="text-gray-500">&#60; Electronics</button>
        </div>
      </div>
      <hr />
      <div>
        <h2>PRICE</h2>
        <br />
        <ProgressBar
          className="m-2"
          completed={-20}
          width={200}
          height={5}
          isLabelVisible={false}
          bgColor={"#3b82f6"}
          dir="ltr"
        />
        <br />
        <div className="flex gap-4">
          <select className="border border-solid" name="min" id="min">
            <option value="">1000</option>
            <option value="">2000</option>
          </select>
          <h3 className="text-gray-500">to</h3>
          <select className="border border-solid" name="Max" id="">
            <option value="">3000+</option>
          </select>
        </div>
      </div>
      <hr />
      <div>
        <h2>BRAND</h2>
      </div>
      <hr />
      <div>
        <h2>CUSTOMER RATING</h2>
        <input type="checkbox" name="checkbox1" id="chexbox1" />
        <label> 4 &#9733; &above </label>
      </div>

      <hr />
    </div>
  );
}

export default Filters;
