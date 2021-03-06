module.exports = class RuntimeResult {
    constructor() {
        this.reset();
    }

    reset() {
        this.error = null;
        this.value = null;
    }

    register(res) {
        this.error = res.error;
        this.value = res.value;
        return this.value;
    }

    success(value) {
        this.reset();
        this.value = value;
        return this;
    }

    failure(error) {
        this.reset();
        this.error = error;
        return this;
    }
};
