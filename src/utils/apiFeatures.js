class APIFeatures {
  #defaultPage = 0;
  #defaultLimit = 100;

  constructor(query, page, limit, sort, fields, queryObj) {
    this.query = query;
    this.page = page;
    this.limit = limit;
    this.sort = sort;
    this.fields = fields;
    this.queryObj = queryObj;
  }

  globalList() {
    this.query = this.query.find({ published: true });

    return this;
  }

  myRecipes() {
    this.query = this.query.find({
      "createdBy.authorId": this.queryObj.authorId,
    });

    return this;
  }

  pagination() {
    const skip = this.page ?? this.#defaultPage;
    const pageLimit = this.limit ?? this.#defaultLimit;

    this.query = this.query.skip(skip).limit(pageLimit);
    return this;
  }

  limitFields() {
    if (this.fields) {
      const fieldsStr = this.fields.split(",").join(" ");
      this.query = this.query.select(fieldsStr);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}

module.exports = APIFeatures;
