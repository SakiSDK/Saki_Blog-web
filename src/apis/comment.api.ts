import { del, post, get } from "@/utils/request";
import { useToken } from "@/utils/useToken";
import snakecaseKeys from 'snakecase-keys'
import { omitBy, isUndefined } from 'lodash'



const { getToken } = useToken()
export class CommentApi {
    static async getAllCommentCount(): Promise<number> {
        const res = await get(`/api/v1/web/comment/count`)
        return res.data;
    }
    
    static async getComments(shortId: string, params: {
        page?: number,
        limit?: number,
    }) {
        const res = await get(`/api/v1/web/post/${shortId}/comment`, {
            page: params.page || 1,
            limit: params.limit || 10
        })
        console.log(res);
        return res;
    }
    static async createComment(shortId: string, data: {
        user_device: string,
        user_browser: string,
        content: string,
        parent_id?: number
    }) {
        const res = await post(
            `/api/v1/web/post/${shortId}/comment`,
            omitBy(snakecaseKeys(data || {}, { deep: true }), isUndefined),
            {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
        )
        return res;
    }

    static async deleteComment(shortId: string, commentId: string) {
        const res = await del(`/api/v1/web/comment/${commentId}`, undefined, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
        return res;
    }
}