import { VM } from "vm2";

export default class Vm2Manager {

    private static instance: Vm2Manager;
    public vm: VM;

    private constructor() {
        this.vm = new VM();
    }

    static getInstance(): Vm2Manager {
        if (!this.instance)
            this.instance = new Vm2Manager();

        return this.instance;
    }
}