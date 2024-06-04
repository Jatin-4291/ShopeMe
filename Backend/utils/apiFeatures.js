export class ApiFeatures {
  constructor(query, queryRequest) {
    this.query = query;
    this.queryRequest = queryRequest;
  }
  filter() {
    let queryObj = { ...this.queryRequest };
    const excludeFeilds = ["sort", "limit", "fields", "page", "search"];
    excludeFeilds.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);

    return this;
  }
  sort() {
    if (this.queryRequest.sort) {
      const sortBy = this.queryRequest.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  fields() {
    if (this.queryRequest.fields) {
      const fields = this.queryRequest.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  pagination() {
    const page = this.queryRequest.page * 1 || 1;
    const limit = this.queryRequest.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  search() {
    if (this.queryRequest.search) {
      this.query = this.query.find({
        mobileNumber: { $regex: this.queryRequest.search, $options: "i" },
      });
    }
    return this;
  }
}
