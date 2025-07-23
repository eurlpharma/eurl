import "simplebar-react/dist/simplebar.min.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { getParcels } from "@/store/slices/deliverySlice";
import DeliveryTable from "@/components/tables/DeliveryTable";

const DeliveryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    parcels: { loading, data, error },
  } = useSelector((state: RootState) => state.delivery);

  useEffect(() => {
    dispatch(getParcels());
  }, [dispatch]);

  if (loading) {
    return <div>wait....</div>;
  }

  if (!loading && error) {
    return <div>Error</div>;
  }

  !loading && data.length > 0 && console.log(data);

  return (
    <DeliveryTable
      header="Parcels"
      subHeader="Guepex parcels"
      error={error}
      loading={loading}
      parcels={data}
    />
  );
};

export default DeliveryPage;
