import CustomConnectButton from "@/components/CustomConnectButton";
import {Button} from "@heroui/react";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabaseClient";

const ConnectPage = () => {

  const [state, setState] = useState([]);

  useEffect(() => {
    const x = async () => {
      const r = await supabase
        .from("a-test")
        .select()
      setState(r.data)
    }
    x()
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <CustomConnectButton />
      {/*<ConnectButton />*/}
      <Button>Hi</Button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default ConnectPage;
