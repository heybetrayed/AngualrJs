import {HttpParams} from '@angular/common/http';

export const createRequestOption = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();
    if (req) {
        Object.keys(req).forEach(key => {
            if(key !== 'sort'){
                options = options.set(key, req[key]);
            }
        });

        if(req.sort){
            req.sort.forEach(val => {
                options = options.append('sort', val);
            })
        }
        options.set('page', req.page);
        options.set('size', req.size);
        options.set('query', req.query);
        options.set('filter', req.filter);

    }
    return options;
};
