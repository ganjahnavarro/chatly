import Fetch from './Fetch'

let Provider = {
    filteredItems: {}
};

Provider.loadAgents = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("agent/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadUnits = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("unit/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadCategories = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("category/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadSuppliers = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("supplier/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadStocks = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("stock/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadBrands = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("brand/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadCustomers = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("customer/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadCustomerDiscounts = function(customerId, callback) {
    Fetch.get(`customerDiscount/${customerId}`, null, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.getStocks = (input, callback) => {
    let parameters = {
        filter: input,
        orderedBy: "name",
        pageSize: 10
    };

    Fetch.get("stock/", parameters, (items) => {
        Provider.filteredItems.stock = items;

        if (items) {
            let filteredStocks = items.map((item) => {
                return {value: item.id, label: item.name}
            });
            callback(null, { options: filteredStocks, cache: false });
        }
    });
};

export default Provider;
