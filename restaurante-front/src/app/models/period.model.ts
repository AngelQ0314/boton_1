export interface Period {
  _id: any;
  restaurant_id: any;
  user_id: any;
  cdn_id: any;

  restaurant_name: string;
  cdn_restaurant_name: string;

  start_date: string | Date;
  final_date: string | Date | null;

  periodtype: string;

  status_Period: {
    status_name: string;
  };
}
