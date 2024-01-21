export type Bookmark = {
  _id: string;
  collectionId: string;
  summary?: string;
  link: string;
  context: string;
  tags?: string[];
};

export type Collection = {
  _id: string;
  name: string;
  description: string;
};
