import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Tuple, TupleBuilder } from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        var matrixA = new TupleBuilder();
        var a1 = new TupleBuilder();
        a1.writeNumber(1);
        a1.writeNumber(2);
        a1.writeNumber(3);
        var a2 = new TupleBuilder();
        a2.writeNumber(4);
        a2.writeNumber(5);
        a2.writeNumber(6);
        matrixA.writeTuple(a1.build());
        matrixA.writeTuple(a2.build());


        var matrixB = new TupleBuilder();
        var b1 = new TupleBuilder();
        b1.writeNumber(10);
        b1.writeNumber(11);
        var b2 = new TupleBuilder();
        b2.writeNumber(20);
        b2.writeNumber(21);
        var b3 = new TupleBuilder();
        b3.writeNumber(30);
        b3.writeNumber(31);

        matrixB.writeTuple(b1.build());
        matrixB.writeTuple(b2.build());
        matrixB.writeTuple(b3.build());

        let res = await blockchain.runGetMethod(
            task2.address,
            "matrix_multiplier",
            [{'type': 'tuple', 'items': matrixA.build()}, 
            {'type': 'tuple', 'items': matrixB.build()}]
        );
        console.log(res.stack.at(0));
    });
});
