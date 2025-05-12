import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeStore } from './initializeStore';
import { RequestState } from '../components/utils/enums';

export const useStoreInitializer = () => {
  const dispatch = useDispatch();

  const busesStatus = useSelector(state => state.buses.status);
  const paymentsStatus = useSelector(state => state.payments.status);
  const vehiclesStatus = useSelector(state => state.vehicles.status);
  const driversStatus = useSelector(state => state.drivers.status);

  const isAnySliceUninitialized = [busesStatus, paymentsStatus, vehiclesStatus, driversStatus].some(status => status === RequestState.IDLE);

  useEffect(() => {
    if (isAnySliceUninitialized) {
      initializeStore(dispatch);
    }
  }, [dispatch, isAnySliceUninitialized]);
};
