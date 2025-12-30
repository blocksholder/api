export class PaymentDTO {
        id: string 
        data: string 
        createdAt: Date

        constructor(data: any) {
          this.id = data.id;
          this.data = data.data;
          this.createdAt = data.createdAt;
           }

        }