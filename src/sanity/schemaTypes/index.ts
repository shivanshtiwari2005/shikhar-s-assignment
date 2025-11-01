import { postType } from "./postType";
import { authorType } from "./authorType";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";

export const schemaTypes = [postType, authorType, categoryType, blockContentType];

export const schema = {
  types: schemaTypes,
};
