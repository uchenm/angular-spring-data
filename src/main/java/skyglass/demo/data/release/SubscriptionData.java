package skyglass.demo.data.release;

import org.springframework.data.jpa.repository.JpaRepository;

import skyglass.demo.data.model.release.Subscription;

public interface SubscriptionData extends JpaRepository<Subscription, Long> {

}