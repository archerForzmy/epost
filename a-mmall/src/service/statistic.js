import MMUtil from 'util/mm.js';

const _mm = new MMUtil();

export default class Statistic{
    getHomeCount(){
    	return _mm.request({
            url : _mm.getServerUrl('/manage/statistic/base_count.do'),
            method  : 'POST',
        });
    }

    getSystemDate(){
    	return _mm.request({
            url : _mm.getServerUrl('/manage/statistic/now.do'),
            method  : 'POST',
        });
    }
}