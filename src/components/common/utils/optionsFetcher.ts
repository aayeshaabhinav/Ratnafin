import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { transformDependentFieldsState } from "packages/form";
import { pincode } from "registry/fns/misc";

const computeDependentKey = (dependentValues = {}) => {
  let keys = Object.keys(dependentValues).sort();
  return keys.reduce((accum, one) => {
    accum[one] = dependentValues[one].value;
    return accum;
  }, {});
};
const computeFormStateKey = (formState: any = {}) => {
  const { fromCode, moduleType, productType, ...others } = formState;
  return others;
};

export const useOptionsFetcher = (
  formState,
  options,
  setOptions,
  handleChangeInterceptor,
  dependentValues,
  incomingMessage,
  runValidation,
  whenToRunValidation,
  _optionsKey,
  disableCaching,
  setIncomingMessage
) => {
  let loadingOptions = false;
  let queryKey: any[] = [];
  if (Boolean(disableCaching)) {
    const dependentKeys = computeDependentKey(dependentValues);
    //const formStateKeys = computeFormStateKey(formState);
    queryKey = [_optionsKey, dependentKeys];
  } else {
    queryKey = [_optionsKey];
  }
  const queryOptions = useQuery(
    queryKey,
    () =>
      options(
        dependentValues,
        formState,
        transformDependentFieldsState(dependentValues)
      ),
    {
      enabled: typeof options === "function",
      cacheTime: 100000000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
  loadingOptions = queryOptions.isLoading;
  useEffect(() => {
    if (options === undefined) {
      setOptions([{ label: "No Data", value: null }]);
      loadingOptions = false;
    } else if (Array.isArray(options)) {
      setOptions(options);
      loadingOptions = false;
    } else if (typeof options === "object") {
      const { options: _options, ...others } = options;
      if (Array.isArray(_options)) {
        setOptions(options);
        if (Object.keys(others).length > 0) {
          setIncomingMessage(others);
        }
      } else {
        setOptions([{ label: "Invalid Data", value: null }]);
      }
      loadingOptions = false;
    } else if (queryOptions.isLoading) {
      setOptions([{ label: "loading...", value: null }]);
      loadingOptions = true;
    } else if (queryOptions.isError) {
      setOptions([{ label: "Couldn't fetch", value: null }]);
      console.log(
        `error occured while fetching data for ${_optionsKey}`,
        queryOptions.error
      );
      loadingOptions = false;
    } else if (Array.isArray(queryOptions.data)) {
      setOptions(queryOptions.data);
      loadingOptions = false;
    } else if (typeof queryOptions.data === "object") {
      const { options: _options, ...others } = queryOptions.data;
      if (Array.isArray(_options)) {
        setOptions(_options);
        if (Object.keys(others).length > 0) {
          setIncomingMessage(others);
        }
      } else {
        setOptions([{ label: "Invalid Data", value: null }]);
      }
      loadingOptions = false;
    } else {
      setOptions([{ label: "Couldn't fetch", value: null }]);
      console.log(
        `expected optionsFunction:${_optionsKey} in select component to return array of OptionsType but got: ${queryOptions.data}`
      );
      loadingOptions = false;
    }
  }, [loadingOptions, queryOptions.dataUpdatedAt]);

  // useEffect(() => {
  //   componentMountedTime.current = new Date().getTime();
  // }, []);

  useEffect(() => {
    const hookCalledTime = new Date().getTime();
    //const timeDiff = Math.abs(hookCalledTime - componentMountedTime.current);
    if (
      //timeDiff > 5000 &&
      incomingMessage !== null &&
      typeof incomingMessage === "object"
    ) {
      const { value } = incomingMessage;
      if (Boolean(value) || value === "") {
        handleChangeInterceptor(value);
        if (whenToRunValidation === "onBlur") {
          runValidation({ value: value }, true);
        }
      }
    }
  }, [
    incomingMessage,
    setOptions,
    handleChangeInterceptor,
    runValidation,
    whenToRunValidation,
  ]);

  return { loadingOptions };
};

/****** ---- */

export const useOptionsFetcherSimple = (
  options,
  setOptions,
  _optionsKey,
  disableCaching,
  optionsProps
) => {
  let loadingOptions = false;

  let queryKey: any[] = [];
  if (Boolean(disableCaching)) {
    queryKey = [_optionsKey, optionsProps];
  } else {
    queryKey = [_optionsKey];
  }
  const queryOptions = useQuery(queryKey, () => options(optionsProps), {
    enabled: typeof options === "function",
    cacheTime: 100000000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  loadingOptions = queryOptions.isLoading;
  useEffect(() => {
    if (options === undefined) {
      setOptions([{ label: "No Data", value: null }]);
      loadingOptions = false;
    } else if (Array.isArray(options)) {
      setOptions(options);
      loadingOptions = false;
    } else if (queryOptions.isLoading) {
      setOptions([{ label: "loading...", value: null }]);
      loadingOptions = true;
    } else if (queryOptions.isError) {
      setOptions([{ label: "Couldn't fetch", value: null }]);
      console.log(
        `error occured while fetching data for ${_optionsKey}`,
        queryOptions.error
      );
      loadingOptions = false;
    } else {
      if (Array.isArray(queryOptions.data)) {
        setOptions(queryOptions.data);
      } else {
        setOptions([{ label: "Couldn't fetch", value: null }]);
        console.log(
          `expected optionsFunction:${_optionsKey} in select component to return array of OptionsType but got: ${queryOptions.data}`
        );
      }
      loadingOptions = false;
    }
  }, [loadingOptions]);

  return { loadingOptions };
};
