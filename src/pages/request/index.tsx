import { type NextPage } from "next";
import Link from "next/link";
import { Button } from "~/components/Button";
import FormInput from "~/components/Forms/FormInput";
import RequestThreadItem from "~/components/RequestPage/RequestThreadItem";
import useInput from "~/hooks/useInput";
import { api } from "~/utils/api";

const RequestListPage: NextPage = () => {
  const { data: requests } = api.productRequests.getRequests.useQuery();

  const [search, setSearch] = useInput("");

  const isRequestEmpty = requests === undefined || requests.length === 0;

  return (
    <section id="product-requests" className="mx-auto min-h-screen max-w-7xl">
      <form className="grid grid-cols-6 gap-x-4">
        <FormInput placeholder="Search for request" className="col-span-5" />

        <Link href={"/request/create"}>
          <Button style="outline">Create Request</Button>
        </Link>
      </form>

      <div className="flex flex-col gap-y-6">
        {isRequestEmpty && <p>There are no requests</p>}

        {!isRequestEmpty &&
          requests.map((request) => (
            <RequestThreadItem key={request.id} thread={request} />
          ))}
      </div>
    </section>
  );
};

export default RequestListPage;
