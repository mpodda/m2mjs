Date.prototype.formatDate = function(){
        
        var year = this.getYear();      
        
        if (year < 2000 || year<1000){
                year+=1900;
                if (year<1000){
                        year+=1900;
                }//if           
        }//if
                        
        return this.getDate() + "/" + String(Number(this.getMonth()) + 1) + "/" + String(year);
        
};//formatDate

//----------------------------------------------------------------------

Date.prototype.addDay = function(d){    
        var newDate = new Date(this.getYear(), this.getMonth(), 1);     
        var newDay = this.getDate() + d;
        
        while(newDay > newDate.getDaysOfMonth()){
                newDay = newDay - newDate.getDaysOfMonth();
                newDate.setMonth(newDate.getMonth()+1);
        }//while
        
        newDate.setDate(newDay);
        
        return newDate;
        
};//addDay

//----------------------------------------------------------------------

Date.prototype.addMonth = function(m){
        /*
        if (this.getYear() < 1000){
                this.setYear(this.getYear()+1900);
        }//if
        */
                
        var newDate = new Date(this.getYear(), this.getMonth(), 1);
        newDate.setMonth(newDate.getMonth() + m);
        
        if (this.getDate()>newDate.getDaysOfMonth()){
                newDate.setDate(newDate.getDaysOfMonth());
        }//if
        else{
                newDate.setDate(this.getDate());
        }//else
        
        return newDate;
        
};//addMonth

//----------------------------------------------------------------------
Date.prototype.getDaysOfMonth = function(){
                
        switch(Number(this.getMonth()+1)){
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                        return 31;
                case 4:
                case 6:
                case 9:
                case 11:
                        return 30;
                case 2:
                        if ((this.getYear()%4==0) || (this.getYear()%1000==0)){
                                return 29;
                        }//if
                        return 28;
        }//switch
};//getDaysOfMonth

//----------------------------------------------------------------------

Date.prototype.getDaysOfYear = function(){
        
        if ((this.getYear()%4==0) || (this.getYear()%1000==0)){
                return 366;
        }//if
        
        return 365;
        
};//getDaysOfYear

//----------------------------------------------------------------------

Date.prototype.getYear2 = function(){
        
        var year = this.getYear();
        
        if (year < 2000 || year<1000){
                year+=1900;
                if (year<1000){
                        year+=1900;
                }//if           
        }//if
        
        return year;
        
};//getYear2

//----------------------------------------------------------------------

Date.prototype.diffDays = function(dateUntil){
 
 /*      
 diff = dateUntil-this;
 days = new String(diff/86400000);
 
 if (days.indexOf(".")>=0){
  days = days.slice(0,days.indexOf("."));
 }
 
 days = Number(days);
 
 return days;
 */
 return (dateUntil-this) / 86400000;
}; //diffDays

//----------------------------------------------------------------------

Date.prototype.parseFromString = function(format, dateString){
        var datePosition = format.indexOf("dd");
        var separator = format.substring(datePosition+2, datePosition+3);

        var dateFormatParts = format.split(separator);
        var dateParts = dateString.split(separator);

        var date, month, year;

        
        for (var i=0; i<dateFormatParts.length; i++){
                if (dateFormatParts[i]=="dd"){
                        date = Number(dateParts[i]);
                }

                if (dateFormatParts[i]=="MM"){
                        month = Number(dateParts[i]);
                }

                if (dateFormatParts[i]=="yyyy"){
                        year = Number(dateParts[i]);
                }
        }
        
        
        this.setFullYear(year, month-1, date);
        
        return this;
};