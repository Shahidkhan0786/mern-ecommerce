// const { json,JSON } = require("express");


class whereclause {
    constructor(base, bigq) {
        this.base = base;
        this.bigq = bigq;
    }

    search() {
        const searchwords = this.base.search ?{
            name:{
                $regex: this.base.search,
                $options: 'i'
            }
        }:'';
        this.base = this.base.find(...searchwords);
        return this;
    }

    
    filter(){
        const copyQ ={...this.bigq};
        delete copyQ.page;
        delete copyQ.search;
        delete copyQ.limit;
        let stringofcopyq  = JSON.stringify(copyQ);
        stringofcopyq = stringofcopyq.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        const jsonofcopyq = JSON.parse(stringofcopyq);
        this.base = this.base.find(jsonofcopyq);   
        return this;
    }

    pager(resultperpage) {
        // const skip = (this.base.page - 1) * resultperpage;
        // this.base = this.base.skip(skip).limit(resultperpage);
        // return this;
        let currentpage = this.base.page;
        if(this.bigq.page){
            currentpage = this.bigq.page;
        }
        let skip = (currentpage - 1) * resultperpage;
        this.base = this.base.skip(skip).limit(resultperpage);
        return this;
    }
}

module.exports = whereclause;