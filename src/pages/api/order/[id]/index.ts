import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderByPlaceId } from '@/services/order.service';
import { getUser } from '@/services/user.service';
interface ResponseData {
    createdAt: Date;
    totalPrice: number;
    donorName: string;
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const getOrder = await getOrderByPlaceId(id as string);

    if (!getOrder) {
        res.status(404).json({ message: 'Order not found' });
        return;
    }

    const responseData: ResponseData[] = [];
    for (const order of getOrder) {
        const user = await getUser(order.donorId);

        responseData.push({
            createdAt: order.createdAt,
            totalPrice: order.totalPrice,
            donorName: user.data()!.name
        } as ResponseData);
    }

    res.status(200).json(responseData);


    return res.status(200).json(responseData);
 
    
}
export default handler;