export type ProductBrowseData = {
  id: string;
  title: string;
  description: string | null;
  categories: string[];
  price: number;
  cover_url: string | null;
  owner: {
    id: string;
    name: string | null;
  };
};
