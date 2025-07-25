import "simplebar-react/dist/simplebar.min.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { getParcels } from "@/store/slices/deliverySlice";
import DeliveryTable from "@/components/tables/DeliveryTable";

const DeliveryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const parcels = useSelector((state: RootState) => state.delivery.parcels) || { loading: false, data: [], error: null };
  const { loading, data, error } = parcels;

  useEffect(() => {
    dispatch(getParcels());
  }, [dispatch]);

  if (loading) {
    return <div>wait....</div>;
  }

  if (!loading && error) {
    return <div>Error</div>;
  }

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
