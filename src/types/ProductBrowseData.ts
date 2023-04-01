export type ProductBrowseData = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  cover_url: string | null;
  owner: {
    name: string | null;
  };
};
