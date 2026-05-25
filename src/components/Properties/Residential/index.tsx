import { propertyHomes } from "@/app/api/propertyhomes";
import PropertyCard from "@/components/Home/Properties/Card/Card";

const ResidentialList: React.FC = () => {
  return (
    <section className="pt-0!">
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {propertyHomes.slice(0, 3).map((item, index) => (
            <div key={index} className="">
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResidentialList;
