import { VM, VMScript } from 'vm2'

export class JsRunnerError extends Error {
    innerError: Error;

    constructor(message: string, innerErr: any) {
        super(message);

        this.innerError = innerErr;

        Object.setPrototypeOf(this, JsRunnerError.prototype);
    }
}

export class JsRunner {

    private script: VMScript;
    private vm: VM;

    constructor(vm: VM, code: string) {
        this.vm = vm;
        this.script = new VMScript(code);
    }

    run<TContext>(context: TContext): string {
        try {
            const scriptResult = this.vm.run(this.script)
            return scriptResult(context);
        }
        catch (err) {
            throw new JsRunnerError(`Script couldn't be executed`, err);
        }
    }

    compile(): void {
        try {
            this.script.compile();
        }
        catch (err) {
            throw new JsRunnerError(`Script couldn't be compiled`, err);
        }
    }

}